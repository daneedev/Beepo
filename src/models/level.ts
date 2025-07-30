import { DataTypes, Model } from "sequelize"
import { db } from "../db"

class Level extends Model {
    declare id: number;
    declare guildId: string;
    declare userId: string;
    declare currentLevel: number;
    declare currentXp: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Level.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guildId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currentLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    currentXp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: "levels",
    sequelize: db
})

Level.sync()

export default Level;