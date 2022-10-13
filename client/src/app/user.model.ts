interface UserModel {
  user_id?: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  user_email: string;
  user_phone: string;
  user_address: string;
  role_name: string;
  customer_name: string;
}

enum ROLE {
  SUPERADMIN = 'Super Admin',
  ADMIN = 'Admin',
  SUBSCRIBER = 'Subscriber',
}

export { ROLE, UserModel };
