using System;
using PlanningRoom.Web.Models;

namespace PlanningRoom.Web.Services
{
    public interface IStorageService
    {
        void SetRoom(Room room);
        void UpdateRoom(string roomId, Action<Room> updateAction);
    }
}
