import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/taskmanager");
    console.log(" MongoDB");

    app.listen(3000, () => {
      console.log(" Server ");
    });
  } catch (error) {
 console.log(error);
  }
};

connectDB();


interface ITask {
  title: string;
  description?: string;
  completed?: boolean;
}



const taskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false, 
  },
});

const Task = mongoose.model<ITask>("Task", taskSchema);


class TaskController {
  add = async (req: express.Request, res: express.Response) => {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      const task = new Task({ title, description });
      const savedTask = await Task.insertOne(task)

      res.json({ message: "Task added successfully" });
    } catch (error) {
      res.json({ message: "Server error" });
    }
  };

  getAll = async (req: express.Request, res: express.Response) => {
    try {
      const tasks = await Task.find();
      if (tasks.length === 0) {
        return res.json({ message: "No tasks found" });
      }
      res.json({ tasks });
    } catch (error) {
      res.json({ message: "Server error" });
    }
  };

  update = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, completed }
     
      );

      res.json({ message: "Task updated successfully" });
    } catch (error) {
      res.json({ message: "Server error" });
    }
  };

  delete = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const deletedTask = await Task.findByIdAndDelete(id);

      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.json({ message: "Server error" });
    }
  };
}



const taskController = new TaskController();

app.post("/tasks", taskController.add);
app.get("/tasks", taskController.getAll);
app.put("/tasks/:id", taskController.update);
app.delete("/tasks/:id", taskController.delete);





