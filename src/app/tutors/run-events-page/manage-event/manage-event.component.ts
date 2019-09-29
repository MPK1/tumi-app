/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tag } from 'rxjs-spy/operators';
import { distinctUntilChanged, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { log } from 'util';
import { TumiEvent } from '../../../shared/services/event.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.scss']
})
export class ManageEventComponent implements OnInit {
  event$: Observable<TumiEvent>;
  tutorEmail$: Observable<string>;
  studentEmail$: Observable<string>;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.event$ = this.route.paramMap.pipe(
      switchMap(params => this.userService.getEventWithUsers(params.get('eventId'))),
      share(),
      startWith(this.route.snapshot.data[0])
    );
    this.tutorEmail$ = this.event$.pipe(map(event => 'mailto:' + event.tutorUsers.map(tutor => tutor.email).join(',')));
    this.studentEmail$ = this.event$.pipe(
      map(
        event =>
          `mailto:?subject=${encodeURIComponent(`[TUMi] ${event.name}`)}&bcc=${event.userSignups
            .map(signup => signup.user.email)
            .join(',')}`
      )
    );
  }
}
