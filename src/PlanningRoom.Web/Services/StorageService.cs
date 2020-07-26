using System;
using System.Threading;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using PlanningRoom.Web.Configuration;
using PlanningRoom.Web.Models;

namespace PlanningRoom.Web.Services
{
    internal class StorageService : IStorageService
    {
        private const string LockerStoragePrefix = "locker";

        private readonly TimeSpan _roomExpireIn;
        private readonly TimeSpan _lockerExpireIn;

        private readonly IOptions<RoomOptions> _options;
        private readonly IMemoryCache _cache;

        public StorageService(IOptions<RoomOptions> options, IMemoryCache cache)
        {
            _options = options;
            _cache = cache;

            _roomExpireIn = _options.Value.Lifetime;
            _lockerExpireIn = _roomExpireIn.Add(TimeSpan.FromSeconds(10));
        }

        public void SetRoom(Room room)
        {
            Set(new SemaphoreSlim(1), room);
        }

        public void UpdateRoom(string roomId, Action<Room> updateAction)
        {
            var locker = GetLocker(roomId);
            if (locker == null)
                throw new InvalidOperationException($"There is no locker for room with ID: {roomId}");

            if (!locker.Wait(2000))
                throw new InvalidOperationException($"Can not enter semaphore for room with ID: {roomId}");

            try
            {
                var room = GetRoom(roomId);
                if (room == null)
                    throw new InvalidOperationException($"There is no room with ID: {roomId}");

                updateAction(room);

                Set(locker, room);
            }
            finally
            {
                locker.Release();
            }
        }

        private void Set(SemaphoreSlim semaphore, Room room)
        {
            if (!room.Id.IsNullOrEmpty())
            {
                _cache.Set(GetLockerKey(room.Id), semaphore, _lockerExpireIn);
                _cache.Set(room.Id, room, _roomExpireIn);
            }
            if (!room.AdminId.IsNullOrEmpty())
            {
                _cache.Set(GetLockerKey(room.AdminId), semaphore, _lockerExpireIn);
                _cache.Set(room.AdminId, room, _roomExpireIn);
            }
        }

        private string GetLockerKey(string roomId)
            => $"{LockerStoragePrefix}{roomId}";

        private SemaphoreSlim GetLocker(string roomId)
            => _cache.Get<SemaphoreSlim>(GetLockerKey(roomId));

        private Room GetRoom(string roomId)
            => _cache.Get<Room>(roomId);
    }
}
