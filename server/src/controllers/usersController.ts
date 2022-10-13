// import express from "express";
import { Request, Response } from "express";

const pool = require("../util/db");

exports.getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await pool.query(
      "SELECT user_id, firstname, middlename, lastname, user_email, user_phone, user_address, role_name, customer_name FROM users LEFT JOIN roles ON roles.role_id = users.rid LEFT JOIN customers ON customers.customer_id = users.cid;"
    );
    res.json(allUsers.rows);
  } catch (error) {
    console.log(error);
  }
};

exports.postUser = async (req: Request, res: Response) => {
  try {
    // console.log("HIT POST");

    const {
      firstname,
      middlename,
      lastname,
      user_email,
      user_phone,
      user_address,
      role_name,
      customer_name,
    } = req.body;
    const rid = role_name === "Super Admin" ? 1 : role_name === "Admin" ? 2 : 3;
    // console.log(rid);

    let cid = await pool.query(
      "INSERT INTO customers(customer_name) values ($1) RETURNING *",
      [customer_name]
    );
    cid = cid.rows[0].customer_id;
    // console.log(cid);
    await pool.query(
      "INSERT INTO users(firstname, middlename, lastname,user_email,user_phone,user_address,rid,cid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [
        firstname,
        middlename,
        lastname,
        user_email,
        user_phone,
        user_address,
        rid,
        cid,
      ]
    );

    const allUsers = await pool.query(
      "SELECT user_id, firstname, middlename, lastname, user_email, user_phone, user_address, role_name, customer_name FROM users LEFT JOIN roles ON roles.role_id = users.rid LEFT JOIN customers ON customers.customer_id = users.cid;"
    );
    res.json(allUsers.rows);
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req: Request, res: Response) => {
  try {
    let user_id: number = Number(req.params.id);
    let cid = await pool.query("SELECT cid from users WHERE user_id =($1)", [
      user_id,
    ]);
    cid = cid.rows[0].cid;
    let previousCustomerName = await pool.query(
      "SELECT customer_name from customers WHERE customer_id=($1)",
      [cid]
    );
    previousCustomerName = previousCustomerName.rows[0].customer_name;

    const {
      firstname,
      middlename,
      lastname,
      user_email,
      user_phone,
      user_address,
      role_name,
      customer_name,
    } = req.body;

    if (previousCustomerName !== customer_name) {
      await pool.query(
        "UPDATE customers SET customer_name = ($1) WHERE customer_id=($2)",
        [customer_name, cid]
      );
    }
    await pool.query(
      "UPDATE users SET firstname = ($1), middlename= ($2) , lastname = ($3), user_email= ($4), user_phone = ($5), user_address = ($6) WHERE user_id = ($7)",
      [
        firstname,
        middlename,
        lastname,
        user_email,
        user_phone,
        user_address,
        user_id,
      ]
    );
    const allUsers = await pool.query(
      "SELECT user_id, firstname, middlename, lastname, user_email, user_phone, user_address, role_name, customer_name FROM users LEFT JOIN roles ON roles.role_id = users.rid LEFT JOIN customers ON customers.customer_id = users.cid;"
    );
    res.json(allUsers.rows);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (req: Request, res: Response) => {
  try {
    const id: number = Number(req.params.id);
    let cid = await pool.query("SELECT cid from users WHERE user_id=($1)", [
      id,
    ]);
    cid = cid.rows[0].cid;
    // console.log(cid);

    await pool.query("DELETE FROM users WHERE user_id=($1)", [id]);
    await pool.query("DELETE FROM customers WHERE customer_id=($1)", [cid]);
    const allUsers = await pool.query(
      "SELECT user_id, firstname, middlename, lastname, user_email, user_phone, user_address, role_name, customer_name FROM users LEFT JOIN roles ON roles.role_id = users.rid LEFT JOIN customers ON customers.customer_id = users.cid;"
    );
    res.json(allUsers.rows);
  } catch (error) {
    console.log(error);
  }
};
