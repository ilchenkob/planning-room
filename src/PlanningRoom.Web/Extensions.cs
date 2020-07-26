using System;
namespace PlanningRoom.Web
{
    internal static class Extensions
    {
        public static bool IsNotAdminRoomId(this string roomId)
        {
            return string.IsNullOrEmpty(roomId) || roomId.Length < 32;
        }

        public static bool IsAdminRoomId(this string roomId)
        {
            return !string.IsNullOrEmpty(roomId) && roomId.Length > 30;
        }

        public static bool IsNullOrEmpty(this string str)
        {
            return string.IsNullOrEmpty(str);
        }
    }
}
