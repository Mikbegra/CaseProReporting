using Domaincasepro.Commands;
using Domaincasepro.Queries;
using Domaincasepro.Repository;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var conString = builder.Configuration.GetSection("ConnectionStrings").GetSection("ConnectionString").Value;
builder.Services.AddDbContext<Modelcasepro.Entities.LandingCaseproDbContext>(options =>
                options.UseSqlServer(conString));
builder.Services.AddTransient<ILoginRepository, LoginRepository>();

builder.Services.AddScoped<LoginQueryHandler>();
builder.Services.AddScoped<LoginCommandHandler>();


builder.Services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
              .AddCookie(x => x.LoginPath = "/");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();
