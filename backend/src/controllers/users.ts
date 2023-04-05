import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

async function listUsers(req: Request, res: Response) {
  const { search } = req.query;
  try {
    const users = await prisma.user.findMany({
      where: { name: { contains: search as string } },
    });
    const count = await prisma.user.count({
      where: { name: { contains: search as string } },
    });

    const average = await prisma.user.aggregate({_avg:{id:true},_count:{_all:true},_sum:{id:true}});
    console.log(average)
    res.status(200).json({ users, count });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

async function createUsers(req: Request, res: Response) {
  const { email,name,password } = req.body;
  try {
    if(!email||!name||!password){
      return res.status(400).json({message:"Email, nome e senha são obrigatórios"})
    }

    const emailExists = await prisma.user.findFirst({where:{email}})

    if(emailExists){
      return res.status(400).json({message:"Email já cadastrado"})
    }

    const result = await prisma.user.create({
      data: {email,name,password},
    });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

async function updateUsers(req: Request, res: Response) {
  const { email,name,password } = req.body;
  const { id } = req.params;
  try {
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) || undefined },
        data:{ email,name,password },
      });

      res.status(200).json(updatedUser);

  } catch (error: any) {
    if(error.meta.cause==="Record to update not found."){
      res.status(400).json({ message: "Usuário não encontrado" });
    }
    res.status(400).json({ message: error.message });
  }
}


export{
  listUsers,createUsers,updateUsers
}
