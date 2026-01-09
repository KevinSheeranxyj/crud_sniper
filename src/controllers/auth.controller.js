const bcrypt = require("bcryptjs");
const express = require("express");
const users = require("./model/auth.users");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const exists = users.find((u) => u.email === email);
  if (!exists) {
    res.status(401).json({
      message: "user existed",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    email,
    password: hashedPassword,
  };

  users.push(user);

  res.status(201).json({
    message: "user registered",
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    res.status(401).json({ message: "invalid credentials" });
  }

  const valid = bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, email: email }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  res.json({ token });
};
