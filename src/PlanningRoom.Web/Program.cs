using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;

namespace PlanningRoom.Web
{
    public class Program
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage(
            "Design", "CA1031:Do not catch general exception types",
            Justification = "Logger needs to write all types of exception")]
        public static int Main(string[] args)
        {
            try
            {
                Log.Information("Starting web service");
                CreateHostBuilder(args).Build().Run();

                return 0;
            }
            catch (Exception e)
            {
                Log.Fatal(e, "Web service terminated");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
