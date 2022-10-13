import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/user.model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  addUserForm!: FormGroup;
  showAddForm: boolean = false;
  showAddButton: boolean = true;

  @Output() onSubmitUser = new EventEmitter();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.addUserForm = new FormGroup({
      firstName: new FormControl('abc', Validators.required),
      middleName: new FormControl(null),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      roleName: new FormControl('Subscriber', Validators.required),
      customerName: new FormControl(null, Validators.required),
    });
  }
  onSubmit() {
    let newUser: UserModel = {
      firstname: this.addUserForm.value.firstName,
      lastname: this.addUserForm.value.lastName,
      middlename: this.addUserForm.value.middleName,
      user_email: this.addUserForm.value.email,
      user_phone: this.addUserForm.value.phone,
      user_address: this.addUserForm.value.address,
      role_name: this.addUserForm.value.roleName,
      customer_name: this.addUserForm.value.customerName,
    };

    this.showAddForm = false;
    this.showAddButton = true;

    this.userService.postUser(newUser).subscribe((_) => {
      this.addUserForm.reset();
      this.onSubmitUser.emit();
    });
  }
}
