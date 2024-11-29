using ClosedXML.Excel;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Office2010.Excel;
using ExcelDataReader;
using LandingCash.Models;
using LandingRepoModel.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.CodeAnalysis.RulesetToEditorconfig;
using Modelcasepro.Entities;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Text;

namespace LandingCash.Controllers
{
    [Authorize]
    public class LandingController : BaseController
    {
        private readonly LandingCaseproDbContext _context;
        readonly IConfiguration _configuration;
        public LandingController(LandingCaseproDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            
            var ReportTypes = GetReportTypes();

            var ReportTypeId = TempData["ReportTypeId"] == null ? 0 : Convert.ToInt32(TempData["ReportTypeId"]);

            if (ReportTypes.Count() > 0 && ReportTypeId == 0)
                ReportTypeId = Convert.ToInt32(ReportTypes.Select(R => R.Value).FirstOrDefault());
            var MonthId = TempData["MonthId"] == null ? DateTime.Now.Month : Convert.ToInt32(TempData["MonthId"]);
            var YearId = TempData["YearId"] == null ? DateTime.Now.Year : Convert.ToInt32(TempData["YearId"]);

            TempData["ReportTypeId"] = ReportTypeId;
            TempData["MonthId"] = MonthId;
            TempData["YearId"] = YearId;
            var model = new LandingListModel()
            {
                ReportTypeId = ReportTypeId,
                MonthId = MonthId,
                YearId = YearId,
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
            TempData["YearId"] = model.YearId;

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
                                         YearId = model.YearId,
                                         LandingId = L.LandingId,
                                         Actuals = L.Actuals.Value,
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
                                             YearId = model.YearId,
                                             LandingId = L.LandingId,
                                             Actuals = L.Actuals.Value,
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

            var MonthId = TempData["MonthId"] == null ? DateTime.Now.Month : Convert.ToInt32(TempData["MonthId"]);
            var YearId = TempData["YearId"] == null ? DateTime.Now.Year : Convert.ToInt32(TempData["YearId"]);

            TempData["ReportTypeId"] = ReportTypeId;
            TempData["MonthId"] = MonthId;
            TempData["YearId"] = YearId;
            

            var model = new LandingReportModel()
            {
                ReportTypeId = ReportTypeId,
                ReportTypes = ReportTypes,
                MonthId = MonthId,
                YearId = YearId,
                List = GetLandingReport()
            };

            return View(model);
        }

        [HttpPost, ValidateAntiForgeryToken]
        public IActionResult Report(int ReportTypeId, int MonthId, int YearId)
        {
            var ReportTypes = GetReportTypes();

            TempData["ReportTypeId"] = ReportTypeId;
            TempData["MonthId"] = MonthId;
            TempData["YearId"] = YearId;
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
            int YearId = Convert.ToInt32(TempData["YearId"]);

            var list = (from L in _context.LandingDetails
                        join A in _context.ActualsDetails on L.LandingId equals A.LandingId into ALeft
                        from AL in ALeft.Where(LD => LD.ReportTypeId == ReportTypeId && LD.MonthId == MonthId && LD.YearId == YearId).DefaultIfEmpty()
                        select new LandingModel()
                        {
                            LandingId = L.LandingId,
                            ActualsId = AL != null ? AL.ActualsId : 0,
                            Code = L.Code,
                            CostCenter = L.CostCenter,
                            Dept = L.Dept,
                            Nominal = L.Nominal,
                            Description = L.Description,
                            Actuals = AL != null ? AL.Actuals : null,
                            EstimatedId = 0
                        }).ToList();

            return (from L in list
                    join E in _context.MonthEstimates on L.LandingId equals E.LandingId into ELeft
                    from EL in ELeft.Where(E => E.MonthId == MonthId && E.YearId == YearId).DefaultIfEmpty()
                    select new LandingModel()
                    {
                        LandingId = L.LandingId,
                        ActualsId = L.ActualsId,
                        Code = L.Code,
                        CostCenter = L.CostCenter,
                        Dept = L.Dept,
                        Nominal = L.Nominal,
                        Description = L.Description,
                        EstimateTotal = EL != null ? EL.Estimated.ToString() : "0",
                        EstimatedId = EL != null ? EL.Id : 0,
                        Actuals = L.Actuals
                    }).ToList();

            //return (from L in _context.LandingDetails
            //        join A in _context.ActualsDetails on L.LandingId equals A.LandingId into ALeft
            //        from AL in ALeft.Where(LD => LD.ReportTypeId == ReportTypeId && LD.MonthId == MonthId).DefaultIfEmpty()
            //        select new LandingModel()
            //        {
            //            LandingId = L.LandingId,
            //            ActualsId = AL != null ? AL.ActualsId : 0,
            //            Code = L.Code,
            //            CostCenter = L.CostCenter,
            //            Dept = L.Dept,
            //            Nominal = L.Nominal,
            //            Description = L.Description,
            //            Actuals = AL != null ? AL.Actuals : null
            //        }).ToList();
        }

        public List<LandingModel> GetEstimatedDetails()
        {
            int ReportTypeId = Convert.ToInt32(TempData["ReportTypeId"]);
            int MonthId = Convert.ToInt32(TempData["MonthId"]);
            int YearId = Convert.ToInt32(TempData["YearId"]);
            string[] months = DateTimeFormatInfo.CurrentInfo.MonthNames;
            DateTime dateTime = DateTime.Parse("01-" + months[MonthId- 1] + "-" + YearId);
            int LastMonthId = dateTime.AddMonths(-1).Month;
            int LastYearId = dateTime.AddMonths(-1).Year;
            var list = (from L in _context.LandingDetails
                        join A in _context.ActualsDetails on L.LandingId equals A.LandingId into ALeft
                        from AL in ALeft.Where(LD => LD.ReportTypeId == ReportTypeId && LD.MonthId == LastMonthId && LD.YearId == LastYearId).DefaultIfEmpty()
                        select new LandingModel()
                        {
                            LandingId = L.LandingId,
                            ActualsId = AL != null ? AL.ActualsId : 0,
                            Code = L.Code,
                            CostCenter = L.CostCenter,
                            Dept = L.Dept,
                            Nominal = L.Nominal,
                            Description = L.Description,
                            Actuals = AL != null ? AL.Actuals : null,
                            EstimatedId = 0
                        }).ToList();

            return (from L in list
                    join E in _context.MonthEstimates on L.LandingId equals E.LandingId into ELeft
                    from EL in ELeft.Where(E => E.MonthId == MonthId && E.YearId == YearId).DefaultIfEmpty()
                    select new LandingModel()
                    {
                        LandingId = L.LandingId,
                        ActualsId = L.ActualsId,
                        Code = L.Code,
                        CostCenter = L.CostCenter,
                        Dept = L.Dept,
                        Nominal = L.Nominal,
                        Description = L.Description,
                        EstimateTotal = EL != null ? EL.Estimated.ToString() : "0",
                        EstimatedId = EL != null ? EL.Id : 0,
                        ActualsLastMonth = L.Actuals
                    }).ToList();

            //return (from L in _context.LandingDetails
            //        join A in _context.ActualsDetails on L.LandingId equals A.LandingId into ALeft
            //        from AL in ALeft.Where(LD => LD.ReportTypeId == ReportTypeId && LD.MonthId == MonthId).DefaultIfEmpty()
            //        select new LandingModel()
            //        {
            //            LandingId = L.LandingId,
            //            ActualsId = AL != null ? AL.ActualsId : 0,
            //            Code = L.Code,
            //            CostCenter = L.CostCenter,
            //            Dept = L.Dept,
            //            Nominal = L.Nominal,
            //            Description = L.Description,
            //            Actuals = AL != null ? AL.Actuals : null
            //        }).ToList();
        }
        public List<LandingReportListModel> GetLandingReport()
        {
            int ReportTypeId = Convert.ToInt32(TempData["ReportTypeId"]);
            int MonthId = Convert.ToInt32(TempData["MonthId"]);
            int YearId = Convert.ToInt32(TempData["YearId"]);

            return (from L in _context.LandingDetails
                    join A in _context.ActualsDetails on L.LandingId equals A.LandingId into LA
                    from A in LA.DefaultIfEmpty().Where(A => A.ReportTypeId == ReportTypeId && A.MonthId == MonthId && A.YearId == A.YearId)
                    join E in _context.MonthEstimates on L.LandingId equals E.LandingId into LE
                    from E in LE.Where(E => E.MonthId == MonthId && E.YearId == YearId).DefaultIfEmpty()
                    group new { L, A, E } by new
                    {
                        L.LandingId,
                        L.Code,
                        L.CostCenter,
                        L.Dept,
                        L.Nominal,
                        L.Description
                    } into g
                    select new LandingReportListModel
                    {
                        LandingId = g.Key.LandingId,
                        Code = g.Key.Code,
                        CostCenter = g.Key.CostCenter,
                        Dept = g.Key.Dept,
                        Nominal = g.Key.Nominal,
                        Description = g.Key.Description,
                        January = MonthId == 1 ? g.Where(x => x.A != null && x.A.MonthId == 1).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : null,
                        February = MonthId == 2 ? g.Where(x => x.A != null && x.A.MonthId == 2).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : null,
                        March = MonthId == 3 ? g.Where(x => x.A != null && x.A.MonthId == 3).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : null,
                        April = MonthId == 4 ? g.Where(x => x.A != null && x.A.MonthId == 4).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : null,
                        May = MonthId == 5 ? g.Where(x => x.A != null && x.A.MonthId == 5).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : null,
                        June = MonthId == 6 ? g.Where(x => x.A != null && x.A.MonthId == 6).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : null,
                        July = MonthId == 7 ? g.Where(x => x.A != null && x.A.MonthId == 7).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : null,
                        August = MonthId == 8 ? g.Where(x => x.A != null && x.A.MonthId == 8).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : null,
                        September = MonthId == 9 ? g.Where(x => x.A != null && x.A.MonthId == 9).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : null,
                        October = MonthId == 10 ? g.Where(x => x.A != null && x.A.MonthId == 10).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : null,
                        November = MonthId == 11 ? g.Where(x => x.A != null && x.A.MonthId == 11).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : 0,
                        December = MonthId == 12 ? g.Where(x => x.A != null && x.A.MonthId == 12).Select(x => (decimal?)x.A.Actuals).FirstOrDefault() ?? null : 0,
                        JanuaryEst = MonthId == 1 ? g.Where(x => x.E != null && x.E.MonthId == 1).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        FebruaryEst = MonthId == 2 ? g.Where(x => x.E != null && x.E.MonthId == 2).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        MarchEst = MonthId == 3 ? g.Where(x => x.E != null && x.E.MonthId == 3).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        AprilEst = MonthId == 4 ? g.Where(x => x.E != null && x.E.MonthId == 4).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        MayEst = MonthId == 5 ? g.Where(x => x.E != null && x.E.MonthId == 5).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        JuneEst = MonthId == 6 ? g.Where(x => x.E != null && x.E.MonthId == 6).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        JulyEst = MonthId == 7 ? g.Where(x => x.E != null && x.E.MonthId == 7).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        AugustEst = MonthId == 8 ? g.Where(x => x.E != null && x.E.MonthId == 8).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        SeptemberEst = MonthId == 9 ? g.Where(x => x.E != null && x.E.MonthId == 9).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        OctoberEst = MonthId == 10 ? g.Where(x => x.E != null && x.E.MonthId == 10).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        NovemberEst = MonthId == 11 ? g.Where(x => x.E != null && x.E.MonthId == 11).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        DecemberEst = MonthId == 12 ? g.Where(x => x.E != null && x.E.MonthId == 12).Select(x => x.E.Estimated.ToString()).FirstOrDefault() ?? "-" : "-",
                        TotalActuals = g.Where(x => x.A != null).Sum(x => (decimal?)x.A.Actuals) ?? 0,
                        TotalEstimates = g.Where(x => x.E != null).Sum(x => (decimal?)x.E.Estimated) ?? 0,
                    }).ToList();
        }


        public IActionResult Estimated()
        {
            var ReportTypes = GetReportTypes();

            var ReportTypeId = TempData["ReportTypeId"] == null ? 0 : Convert.ToInt32(TempData["ReportTypeId"]);

            if (ReportTypes.Count() > 0 && ReportTypeId == 0)
                ReportTypeId = Convert.ToInt32(ReportTypes.Select(R => R.Value).FirstOrDefault());
            var MonthId = TempData["MonthId"] == null ? DateTime.Now.Month : Convert.ToInt32(TempData["MonthId"]);
            var YearId = TempData["YearId"] == null ? DateTime.Now.Year : Convert.ToInt32(TempData["YearId"]);

            TempData["ReportTypeId"] = ReportTypeId;
            TempData["MonthId"] = MonthId;
            TempData["YearId"] = YearId;
            var model = new LandingListModel()
            {
                ReportTypeId = ReportTypeId,
                MonthId = MonthId,
                YearId = YearId,
                ReportTypes = GetReportTypes(),
                LandingModel = GetEstimatedDetails()
            };

            return View(model);
        }

        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> Estimated(LandingListModel model)
        {
            TempData["IsSuccess"] = null;
            TempData["IsError"] = null;
            TempData["Error"] = null;

            TempData["ReportTypeId"] = model.ReportTypeId;
            TempData["MonthId"] = model.MonthId;
            TempData["YearId"] = model.YearId;

            if (model.IsSave == 0)
                return RedirectToAction(nameof(Estimated));

            if (ModelState.IsValid)
            {
                var estimatedDetail = (from L in model.LandingModel
                                     where L.EstimatedId > 0 && L.EstimateTotal != ""
                                     select new MonthEstimate()
                                     {
                                         Id = L.EstimatedId.Value,
                                         MonthId = model.MonthId,
                                         YearId = model.YearId,
                                         LandingId = L.LandingId,
                                         Estimated = Convert.ToDecimal(L.EstimateTotal)
                                     }).ToList();

                _context.MonthEstimates.UpdateRange(estimatedDetail);
                await _context.SaveChangesAsync();

                var estimatedDetail_Add = (from L in model.LandingModel
                                         where L.EstimatedId == 0 && L.EstimateTotal != ""
                                         select new MonthEstimate()
                                         {
                                             MonthId = model.MonthId,
                                             YearId = model.YearId,
                                             LandingId = L.LandingId,
                                             Estimated = Convert.ToDecimal(L.EstimateTotal)
                                         }).ToList();

                _context.MonthEstimates.AddRange(estimatedDetail_Add);
                await _context.SaveChangesAsync();

                TempData["IsSuccess"] = true;

                return RedirectToAction(nameof(Estimated));
            }

            TempData["IsError"] = true;
            TempData["Error"] = ModelState.Values.SelectMany(v => v.Errors)
                                          .Select(e => e.ErrorMessage)
                                          .ToList();

            model.ReportTypes = GetReportTypes();
            return View(model);
        }

        public IActionResult UploadData()
        {

            var MonthId = TempData["MonthId"] == null ? DateTime.Now.Month : Convert.ToInt32(TempData["MonthId"]);
            var YearId = TempData["YearId"] == null ? DateTime.Now.Year : Convert.ToInt32(TempData["YearId"]);

            TempData["MonthId"] = MonthId;
            TempData["YearId"] = YearId;
            var model = new UploadListModel()
            {
                MonthId = MonthId,
                YearId = YearId
            };

            return View(model);
        }

        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> UploadData(UploadListModel model)
        {
            TempData["MonthId"] = model.MonthId;
            TempData["YearId"] = model.YearId;

            if (model.uploadfile != null && model.uploadfile.Length > 0)
            {
                Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
                Stream stream = model.uploadfile.OpenReadStream();
                IExcelDataReader reader = null;
                if (model.uploadfile.FileName.EndsWith(".xls"))
                {
                    reader = ExcelReaderFactory.CreateBinaryReader(stream);
                }
                else if (model.uploadfile.FileName.EndsWith(".xlsx"))
                {
                    reader = ExcelReaderFactory.CreateOpenXmlReader(stream);
                }
                else
                {
                    ModelState.AddModelError("File", "This file format is not supporting.");
                }
                try
                {
                    DataSet excelFile = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration()
                        {
                            UseHeaderRow = true
                        }
                    });
                    updateReportTypes(excelFile);
                    AddUpdateExcelData(excelFile, model.YearId);
                    TempData["IsSuccess"] = true;
                    TempData["IsError"] = false;
                }
                catch {
                    TempData["IsSuccess"] = false;
                    TempData["IsError"] = true;
                }
            }
            return View(model);
        }

        private async Task<bool> AddUpdateExcelData(DataSet excelFile, int yearid)
        {

            foreach (DataTable dt in excelFile.Tables) {
                List<ExcelDataModel> excelData = new List<ExcelDataModel>();
                DataTable dataTable = dt;
                string reportType = dt.TableName;
                string code = string.Empty;
                string costcenter = string.Empty;
                string dept = string.Empty;
                string nominal = string.Empty;
                string description = string.Empty;
                decimal actual = 0;

                foreach (DataRow row in dt.Rows)
                {
                    if (reportType.ToLower() != "company analysis" && reportType.ToLower() != "budget - company analysis")
                    {
                        ExcelDataModel model = new ExcelDataModel();
                        try
                        {
                            code = row["code"].ToString();
                        }
                        catch { }
                        try
                        {
                            costcenter = row["cost centre"].ToString();
                        }
                        catch { }
                        try
                        {
                            dept = row["dept"].ToString();
                        }
                        catch
                        {
                            try
                            {
                                dept = row["Division/Dept"].ToString();
                            }
                            catch
                            {
                                dept = string.Empty;
                            }

                        }
                        try
                        {
                            nominal = row["nominal"].ToString();
                        }
                        catch { }
                        try
                        {
                            description = row["description"].ToString();
                        }
                        catch { }
                        if ((string.IsNullOrEmpty(code) && !string.IsNullOrEmpty(dept)) && !dept.ToLower().Contains("total"))
                        {
                            try
                            {
                                actual = string.IsNullOrEmpty(row["Jan"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Jan"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 1, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["Feb"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Feb"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 2, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["Mar"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Mar"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 3, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["Apr"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Apr"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 4, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["May"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["May"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 5, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["Jun"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Jun"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 6, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["Jul"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Jul"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 7, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["Aug"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Aug"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 8, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["Sep"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Sep"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 9, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["Oct"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Oct"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 10, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["Nov"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Nov"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 11, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["Dec"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["Dec"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 12, yearid, actual, dept, description);
                            }
                            catch { }
                        }
                        else if ((!string.IsNullOrEmpty(code) && !string.IsNullOrEmpty(dept)) && !dept.ToLower().Contains("total"))
                        {
                            try
                            {
                                actual = string.IsNullOrEmpty(row["January"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["January"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 1, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["February"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["February"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 2, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["March"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["March"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 3, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["April"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["April"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 4, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["May"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["May"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 5, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["June"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["June"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 6, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["July"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["July"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 7, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["August"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["August"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 8, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["September"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["September"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 9, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["October"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["October"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 10, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["November"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["November"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 11, yearid, actual, dept, description);
                                actual = string.IsNullOrEmpty(row["December"].ToString()) ? 0 : Math.Round(Convert.ToDecimal(row["December"].ToString()));
                                saveExcelData(excelData, code, costcenter, nominal, reportType, 12, yearid, actual, dept, description);
                            }
                            catch { }
                        }
                        else
                        {
                            continue;
                        }
                    }
                }
                if (excelData.Count > 0)
                {
                    uploadDataToDatabase(excelData);
                }
                excelData = new List<ExcelDataModel>();
            }
            throw new NotImplementedException();
        }
        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Defining type of data column gives proper data table 
                var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name, type);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }
        private void uploadDataToDatabase(List<ExcelDataModel> excelData)
        {
            DataTable dt = ToDataTable(excelData);
            SqlConnection conn = new SqlConnection();
            try
            {
                conn.ConnectionString = _configuration.GetConnectionString("Connectionstring").ToString();
                SqlCommand cmd = new SqlCommand("dbo.UploadData", conn);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                conn.Open();
                SqlParameter sqlParam = cmd.Parameters.AddWithValue("@data", dt);
                sqlParam.SqlDbType = SqlDbType.Structured;
                cmd.ExecuteNonQuery();
            }
            catch(Exception ex) {
                conn.Close();
            }
        }

        private void saveExcelData(List<ExcelDataModel> excelData, string code, string costcenter, string nominal, string reportType, int monthid
            , int yearid, decimal actual, string dept, string description)
        {
            excelData.Add(new ExcelDataModel
            {
                code = code,
                costcenter = costcenter,
                nominal = nominal,
                reportType = reportType,
                monthid = monthid,
                yearid = yearid,
                actual = actual,
                dept = dept,
                description = description
            });
        }

        private async Task<bool> updateReportTypes(DataSet excelFile)
        {
            bool resp = false;
            List<ReportType> reportTypes = new List<ReportType>();
            foreach (DataTable dt in excelFile.Tables)
            {
                reportTypes.Add(new ReportType
                {
                    ReportTypeId = 0,
                    ReportTypeName = dt.TableName,
                });
            }
            var reportDetail = (from L in reportTypes
                                join A in _context.ReportTypes on L.ReportTypeName equals A.ReportTypeName into reports
                                from AL in reports.DefaultIfEmpty()
                                where AL == null
                                select new ReportType()
                                {
                                    ReportTypeName = L.ReportTypeName
                                }).ToList();
            if (reportDetail.Count > 0)
            {
                _context.ReportTypes.AddRange(reportDetail);
                await _context.SaveChangesAsync();
                resp = true;
            }
            return resp;
        }

        
    }
}