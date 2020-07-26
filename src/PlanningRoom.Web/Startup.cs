using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using PlanningRoom.Web.Configuration;
using PlanningRoom.Web.Services;
using Serilog;

namespace PlanningRoom.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .CreateLogger();
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<RoomOptions>(Configuration.GetSection(
                                        RoomOptions.SettingsKey));

            services.AddControllers().AddNewtonsoftJson();
            services.AddRouting();

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            services.AddMemoryCache();
            services.AddSignalR().AddNewtonsoftJsonProtocol();

            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IRoomService, RoomService>();
            services.AddScoped<IStorageService, StorageService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // app.UseExceptionHandler("/Error");

                app.UseExceptionHandler(a => a.Run(async context =>
                {
                    var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
                    var exception = exceptionHandlerPathFeature?.Error;
                    if (exception != null)
                    {
                        Log.Error(exception, "Request pipeline exception");

                        var result = JsonConvert.SerializeObject(new { error = exception.Message });
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(result);
                    }
                }));
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            // app.UseSerilogRequestLogging();

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<RoomHub>("/roomhub");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
            });
        }
    }
}
