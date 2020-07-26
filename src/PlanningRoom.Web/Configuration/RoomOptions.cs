using System;

namespace PlanningRoom.Web.Configuration
{
    public class RoomOptions
    {
        public const string SettingsKey = "Room";

        public TimeSpan Lifetime { get; set; }
    }
}
