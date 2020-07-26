using System.Collections.Generic;
using System.Threading.Tasks;
using PlanningRoom.Web.Models;

namespace PlanningRoom.Web.Services
{
    public interface INotificationService
    {
        Task NotifyParticipants(string roomId, string notification);
        Task NotifyParticipantsChange(string roomId, bool isVoting, IEnumerable<TeamMember> participants);
        Task NotifyCurrentStoryChange(string roomId, Story story);
        Task NotifyStoriesChange(string roomId, IEnumerable<Story> stories);
        Task NotifyRoomSettingsChange(string roomId, RoomSettings settings);
    }
}
