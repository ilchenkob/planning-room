import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, TeamMember, Story } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(private http: HttpClient) {
  }

  public createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>('/api/room', room);
  }

  public updateRoom(room: Room): Observable<void> {
    return this.http.patch<void>('/api/room', room);
  }

  public joinRoom(roomId: string, teamMember: TeamMember): Observable<Room> {
    return this.http.put<Room>(`/api/room/${roomId}/participants`, teamMember);
  }

  public removeUser(roomId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`/api/room/${roomId}/participants/${userId}`);
  }

  public addStory(roomId: string, story: Story): Observable<Room> {
    return this.http.put<Room>(`/api/room/${roomId}`, story);
  }

  public editStory(roomId: string, story: Story): Observable<Room> {
    return this.http.patch<Room>(`/api/room/${roomId}`, story);
  }

  public deleteStory(roomId: string, internalStoryId: string): Observable<Room> {
    return this.http.delete<Room>(`/api/room/${roomId}/${internalStoryId}`);
  }

  public selectStory(roomId: string, internalStoryId: string): Observable<Room> {
    return this.http.patch<Room>(`/api/room/${roomId}/${internalStoryId}`, null);
  }

  public selectCard(roomId: string, memberId: string, selectedCard: number): Observable<void> {
    return this.http.patch<void>(`/api/room/${roomId}/participants/${memberId}`, { selectedCard });
  }

  public startTimer(roomId: string): Observable<void> {
    return this.http.post<void>(`/api/room/${roomId}/timer`, null);
  }

  public stopTimer(roomId: string): Observable<void> {
    return this.http.delete<void>(`/api/room/${roomId}/timer`);
  }

  public resetCards(roomId: string): Observable<void> {
    return this.http.delete<void>(`/api/room/${roomId}/participants/cards`);
  }

  public setStoryPoints(roomId: string, storyId: string, title: string, storyPoints: number): Observable<void> {
    return this.http.put<void>(`/api/room/${roomId}/storypoints`, { id: storyId, title, storyPoints });
  }
}
