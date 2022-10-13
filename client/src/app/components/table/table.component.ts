import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

import { UserModel } from 'src/app/user.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  headings: string[] = [
    'First Name',
    'Middle Name',
    'Last Name',
    'Email',
    'Phone',
    'Address',
    'Role',
    'Customer Name',
    'Buttons',
  ];
  @Input() usersData: UserModel[] = [];
  initialEntries: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  onAddUser() {
    this.userService
      .getUsers()
      .subscribe((updatedUsers) => (this.usersData = updatedUsers));
  }

  onEdit(event: any) {
    for (let i = 0; i < event.path[2].cells.length - 1; i++) {
      this.initialEntries.push(event.path[2].cells[i].innerText);
    }

    event.path[2].contentEditable = true;

    //Making buttons column non-editable
    event.target.parentElement.contentEditable = false;

    //Making Role column non-editale
    event.target.parentElement.parentElement.children[6].contentEditable =
      false;

    event.target.parentElement.children[0].style.display = 'none';
    event.target.parentElement.children[1].style.display = 'none';
    event.target.parentElement.children[2].style.display = 'block';
    event.target.parentElement.children[3].style.display = 'block';
  }

  onSave(event: any, user: UserModel) {
    event.path[2].contentEditable = false;
    let updatedValues: UserModel = {
      user_id: user.user_id,
      firstname: event.path[2].cells[0].innerText,
      middlename: event.path[2].cells[1].innerText,
      lastname: event.path[2].cells[2].innerText,
      user_email: event.path[2].cells[3].innerText,
      user_phone: event.path[2].cells[4].innerText,
      user_address: event.path[2].cells[5].innerText,
      role_name: event.path[2].cells[6].innerText,
      customer_name: event.path[2].cells[7].innerText,
    };
    console.log(updatedValues);

    this.userService
      .updateUsers(updatedValues)
      .subscribe((updatedUsers) => (this.usersData = updatedUsers));

    event.target.parentElement.children[0].style.display = 'block';
    event.target.parentElement.children[1].style.display = 'block';
    event.target.parentElement.children[2].style.display = 'none';
    event.target.parentElement.children[3].style.display = 'none';
    this.initialEntries = [];
  }

  onCancel(event: any) {
    console.log(this.initialEntries);
    for (let i = 0; i < event.path[2].cells.length - 1; i++) {
      event.path[2].cells[i].innerText = this.initialEntries[i];
    }
    event.path[2].contentEditable = false;
    this.initialEntries = [];

    event.target.parentElement.children[0].style.display = 'block';
    event.target.parentElement.children[1].style.display = 'block';
    event.target.parentElement.children[2].style.display = 'none';
    event.target.parentElement.children[3].style.display = 'none';
  }

  onDelete(user: UserModel) {
    this.userService
      .deleteUser(user.user_id as string)
      .subscribe((updatedUsers) => (this.usersData = updatedUsers));
  }
}
