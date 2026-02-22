import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Todo = sequelize.define(
    "Todo",
    {
        task_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tasks: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        in_use: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        }
    },
    {
        tableName: "todos",
        timestamps: false
    }
);

export default Todo;