using System;

namespace PlanningRoom.Web
{
    internal static class Helpers
    {
        public static string CreateLongId()
        {
            return Guid.NewGuid().ToString().Replace("-", "");
        }

        public static string CreateShortId()
        {
            var id = CreateLongId();
            return $"{id.Substring(0, 6)}{id.Substring(id.Length - 6)}";
        }
    }
}
