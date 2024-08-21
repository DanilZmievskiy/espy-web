import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../server.js";

const jwtSecret = '1424da9f27474403f16b1aa2f0b3d796639463baa8ce231c717a6093c5bc2245781568'

const getPaths = async (req, res) => {
    try {
      const hubsFrom = await prisma.path.findMany({
        distinct: ["hub_from"],
        select: {
          hub_from: true
        }
      });
      const hubsTo = await prisma.path.findMany({
        distinct: ["hub_to"],
        select: {
          hub_to: true
        }
      });
      const pathPrice = await prisma.path.findMany({
        select: {
          hub_from: true,
          hub_to: true,
          price: true
        }
      });
      res.status(200).json({
        from: hubsFrom,
        to: hubsTo,
        price: pathPrice
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  };

const createUser = async (req, res) => {
  try {
    const {username, password, email, phone, role} = req.body

    const usernameExist = await prisma.user.findFirst({
      where: {
        username: username
      }
    })
    const emailExist = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (usernameExist) {
      res.status(400).json({error: "Пользователь с таким именем уже существует"})
    } else if (emailExist) {
      res.status(400).json({error: "Пользователь с таким email уже существует"})
    } else {
      bcrypt.hash(password, 10).then(async (hash) => {
        await prisma.user.create({
          data: {
            username: username,
            password: hash,
            email: email,
            phone: phone,
            role: role
          }
        }).then((createdUser) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: createdUser.id, username, role: createdUser.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json(createdUser)
        })
      })
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

const loginUser = async (req, res) => {
  const { username, password } = req.body
  console.log(req.cookies)
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    })
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username
      }
    })
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 10 * 60 * 60;
          const token = jwt.sign(
            { id: user.id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: "3h", // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
            sameSite: "none",
            secure: "false"
          });
          res.status(200).json({
            message: "User successfully Logged in",
            user: user.id,
            role: user.role,
            token: token
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
      })
    }

  } catch (e) {
    res.status(500).json({ error: e });
  }
}

const createOrder = async (req, res) => {
  try {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          const { from, to, price } = req.body
          const userId = decodedToken.id
          const odersNumber = await prisma.order.count({
            where: {
              user: userId
            }
          });
          const orderPath = await prisma.path.findFirst({
            where: {
              hub_from: from,
              hub_to: to
            },
            select: {
              all_hubs: true
            }
          })
          await prisma.order.create({
            data: {
              number: odersNumber + 1,
              path_hubs: orderPath.all_hubs,
              price: Number(price),
              user: userId,
              created_at: new Date().toISOString(),
              status: 'created'
            }
          }).then((createdOrder) => {
            res.status(201).json(createdOrder)
          })
        }
      })
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

const getUserOrders = async (req, res) => {
  try {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          const userOrders = await prisma.order.findMany({
            where: {
              user: decodedToken.id
            }
          })
          res.status(200).json(userOrders)
        }
      })
    } else {
      res.status(400).json({ error: "Token not presented" })
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

const getAllOrders = async (req, res) => {
  try{
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role == 'admin') {
            const allOrders = await prisma.order.findMany({
              include:{
                user_order_userTouser: true
              }
            })
            res.status(200).json(allOrders)
          }
        }
      })
    } else {
      return res.status(401).json({ message: "Not authorized" })
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

const getAllDrivers = async (req, res) => {
  try{
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role == 'admin') {
            const allOrders = await prisma.user.findMany({
              where: {
                role: 'driver'
              }
            })
            res.status(200).json(allOrders)
          }
        }
      })
    } else {
      return res.status(401).json({ message: "Not authorized" })
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

const approveOrder = async (req, res) => {
  try {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role == 'admin') {
            const { order, driver } = req.body
            const approved = await prisma.order.update({
              where: {
                id: Number(order)
              },
              data: {
                id_driver: Number(driver),
                status: "approved"
              }
            })
            res.status(200).json({ message: "OK" })
          }
        }
      })
    } else {
      return res.status(401).json({ message: "Not authorized" })
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

const getDriverOrders = async (req, res) => {
  try{
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role == 'driver') {
            const driverOrders = await prisma.order.findMany({
              where: {
                id_driver: decodedToken.id
              }
            })
            res.status(200).json(driverOrders)
          }
        }
      })
    } else {
      return res.status(401).json({ message: "Not authorized" })
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

const updateOrderStatus = async (req, res) => {
  try{
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role == 'driver') {
            const { id, status } = req.body
            const updatedOrder = await prisma.order.update({
              where: {
                id: Number(id)
              },
              data: {
                status: status
              }
            })
            res.status(200).json(updatedOrder)
          }
        }
      })
    } else {
      return res.status(401).json({ message: "Not authorized" })
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

const getUser = async (req, res) => {
  try {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          const user = await prisma.user.findFirst({
            where: {
              id: decodedToken.id
            }
          })
          res.status(200).json(user)
        }
      })
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

export default {
    getPaths,
    createUser,
    loginUser,
    createOrder,
    getUserOrders,
    getAllOrders,
    getAllDrivers,
    approveOrder,
    getDriverOrders,
    updateOrderStatus,
    getUser
}