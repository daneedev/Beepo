import { DataTypes, Model } from "sequelize"
import { db } from "../db"

class Config extends Model {
    declare id: number;
    declare guildId: string;
    declare tempBan: boolean;
    declare warnSys: boolean;

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
        allowNull: false
    },
    warnSys: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: "configs",
    sequelize: db
})

Config.sync({ alter: true })

export default Config;