using System.Threading.Tasks;
using PlanningRoom.Web.Models;

namespace PlanningRoom.Web.Services
{
    public interface IRoomService
    {
        Room CreateRoom(Room room);

        Task UpdateRoom(Room room);

        Task AddStory(string roomId, Story story);

        Task EditStory(string roomId, Story story);

        Task SetStoryPoints(string roomId, Story story);

        Task DeleteStory(string roomId, string storyId);

        Task SelectStory(string roomId, string storyId);

        Task<Room> JoinRoom(string roomId, TeamMember member);

        Task RemoveFromRoom(string roomId, string memberId);

        Task SetSelectedCard(string roomId, string memberId, int selectedCard);

        Task ResetCards(string roomId);

        Task StartTimer(string roomId);

        Task StopTimer(string roomId);
    }
}
