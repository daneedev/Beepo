import { DataTypes, Model } from "sequelize"
import { db } from "../db"

class Config extends Model {
    declare id: number;
    declare guildId: string;
    declare tempBan: boolean;
    declare warnSys: boolean;
    declare levelSys: boolean;

}

Config.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guildId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    tempBan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    warnSys: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    levelSys: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: "configs",
    sequelize: db
})

Config.sync({ alter: true })

export default Config;