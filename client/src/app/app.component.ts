import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { UserModel } from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  usersData: UserModel[] = [];
  renderTable: boolean = false;
  loadButtonContent: string = 'Load Data';

  constructor(private userService: UserService) {}

  onLoadData() {
    this.renderTable = true;
    this.loadButtonContent = 'Refresh Data';
    this.userService.getUsers().subscribe((Users) => (this.usersData = Users));
  }
}
