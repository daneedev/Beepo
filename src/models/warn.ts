import { DataTypes, Model } from "sequelize"
import { db } from "../db"

class Warn extends Model {
    declare id: number;
    declare guildId: string;
    declare userId: string;
    declare reason: string;
    declare addedBy: string;
    
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Warn.init({
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
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addedBy: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "warnings",
    sequelize: db
})

Warn.sync()

export default Warn;