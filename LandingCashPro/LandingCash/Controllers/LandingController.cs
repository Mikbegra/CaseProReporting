using LandingCash.Models;
using LandingRepoModel.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Modelcasepro.Entities;

namespace LandingCash.Controllers
{
    [Authorize]
    public class LandingController : BaseController
    {
        private readonly LandingCaseproDbContext _context;

        public LandingController(LandingCaseproDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var ReportTypes = GetReportTypes();

            var ReportTypeId = TempData["ReportTypeId"] == null ? 0 : Convert.ToInt32(TempData["ReportTypeId"]);

            if (ReportTypes.Count() > 0 && ReportTypeId == 0)
                ReportTypeId = Convert.ToInt32(ReportTypes.Select(R => R.Value).FirstOrDefault());
            var MonthId = TempData["MonthId"] == null ? 1 : Convert.ToInt32(TempData["MonthId"]);

            TempData["ReportTypeId"] = ReportTypeId;
            TempData["MonthId"] = MonthId;

            var model = new LandingListModel()
            {
                ReportTypeId = ReportTypeId,
                MonthId = MonthId,
                ReportTypes = GetReportTypes(),
                LandingModel = GetLandingDetails()
            };

            return View(model);
        }

        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(LandingListModel model)
        {
            TempData["IsSuccess"] = null;
            TempData["IsError"] = null;
            TempData["Error"] = null;

            TempData["ReportTypeId"] = model.ReportTypeId;
            TempData["MonthId"] = model.MonthId;

            if (model.IsSave == 0)
                return RedirectToAction(nameof(Index));

            if (ModelState.IsValid)
            {
                var ActualsDetail = (from L in model.LandingModel
                                     where L.ActualsId > 0 && L.Actuals != null
                                     select new ActualsDetail()
                                     {
                                         ActualsId = L.ActualsId,
                                         ReportTypeId = model.ReportTypeId,
                                         MonthId = model.MonthId,
                                         LandingId = L.LandingId,
                                         Actuals = L.Actuals.Value
                                     }).ToList();

                _context.ActualsDetails.UpdateRange(ActualsDetail);
                await _context.SaveChangesAsync();

                var ActualsDetail_Add = (from L in model.LandingModel
                                         where L.ActualsId == 0 && L.Actuals != null
                                         select new ActualsDetail()
                                         {
                                             ActualsId = L.ActualsId,
                                             ReportTypeId = model.ReportTypeId,
                                             MonthId = model.MonthId,
                                             LandingId = L.LandingId,
                                             Actuals = L.Actuals.Value
                                         }).ToList();

                _context.ActualsDetails.AddRange(ActualsDetail_Add);
                await _context.SaveChangesAsync();

                TempData["IsSuccess"] = true;

                return RedirectToAction(nameof(Index));
            }

            TempData["IsError"] = true;
            TempData["Error"] = ModelState.Values.SelectMany(v => v.Errors)
                                          .Select(e => e.ErrorMessage)
                                          .ToList();

            model.ReportTypes = GetReportTypes();
            return View(model);
        }

        public IActionResult Report()
        {
            var ReportTypes = GetReportTypes();

            var ReportTypeId = TempData["ReportTypeId"] == null ? 0 : Convert.ToInt32(TempData["ReportTypeId"]);

            if (ReportTypes.Count() > 0 && ReportTypeId == 0)
                ReportTypeId = Convert.ToInt32(ReportTypes.Select(R => R.Value).FirstOrDefault());

            TempData["ReportTypeId"] = ReportTypeId;

            var model = new LandingReportModel()
            {
                ReportTypeId = ReportTypeId,
                ReportTypes = ReportTypes,
                List = GetLandingReport()
            };

            return View(model);
        }

        [HttpPost, ValidateAntiForgeryToken]
        public IActionResult Report(int ReportTypeId)
        {
            var ReportTypes = GetReportTypes();

            TempData["ReportTypeId"] = ReportTypeId;

            return RedirectToAction(nameof(Report));
        }


        public List<SelectListItem> GetReportTypes()
        {
            return _context.ReportTypes.Select(RT => new SelectListItem { Value = RT.ReportTypeId.ToString(), Text = RT.ReportTypeName }).ToList();
        }

        public List<LandingModel> GetLandingDetails()
        {
            int ReportTypeId = Convert.ToInt32(TempData["ReportTypeId"]);
            int MonthId = Convert.ToInt32(TempData["MonthId"]);

            return (from L in _context.LandingDetails
                    join A in _context.ActualsDetails on L.LandingId equals A.LandingId into ALeft
                    from AL in ALeft.Where(LD => LD.ReportTypeId == ReportTypeId && LD.MonthId == MonthId).DefaultIfEmpty()
                    select new LandingModel()
                    {
                        LandingId = L.LandingId,
                        ActualsId = AL == null ? 0 : AL.ActualsId,
                        Code = L.Code,
                        CostCenter = L.CostCenter,
                        Dept = L.Dept,
                        Nominal = L.Nominal,
                        Description = L.Description,
                        EstimateTotal = L.EstimateTotal,
                        Actuals = AL.Actuals
                    }).ToList();
        }

        public List<LandingReportListModel> GetLandingReport()
        {
            int ReportTypeId = Convert.ToInt32(TempData["ReportTypeId"]);

            return (from L in _context.LandingDetails
                    join A in _context.ActualsDetails on L.LandingId equals A.LandingId into LA
                    from A in LA.DefaultIfEmpty().Where(A => A.ReportTypeId == ReportTypeId)
                    group new { L, A } by new
                    {
                        L.LandingId,
                        L.Code,
                        L.CostCenter,
                        L.Dept,
                        L.Nominal,
                        L.Description,
                        L.EstimateTotal
                    } into g
                    select new LandingReportListModel
                    {
                        LandingId = g.Key.LandingId,
                        Code = g.Key.Code,
                        CostCenter = g.Key.CostCenter,
                        Dept = g.Key.Dept,
                        Nominal = g.Key.Nominal,
                        Description = g.Key.Description,
                        January = g.Where(x => x.A != null && x.A.MonthId == 1).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        February = g.Where(x => x.A != null && x.A.MonthId == 2).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        March = g.Where(x => x.A != null && x.A.MonthId == 3).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        April = g.Where(x => x.A != null && x.A.MonthId == 4).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        May = g.Where(x => x.A != null && x.A.MonthId == 5).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        June = g.Where(x => x.A != null && x.A.MonthId == 6).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        July = g.Where(x => x.A != null && x.A.MonthId == 7).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        August = g.Where(x => x.A != null && x.A.MonthId == 8).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        September = g.Where(x => x.A != null && x.A.MonthId == 9).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        October = g.Where(x => x.A != null && x.A.MonthId == 10).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        November = g.Where(x => x.A != null && x.A.MonthId == 11).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        December = g.Where(x => x.A != null && x.A.MonthId == 12).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null,
                        TotalActuals = g.Where(x => x.A != null).Sum(x => (decimal?)x.A.Actuals) ?? 0
                    }).ToList();
        }
    }
}