import { DataTypes, Model } from "sequelize";
import { db } from "../db"

class TempBan extends Model {
    declare id: number;
    declare guildId: string;
    declare userId: string;
    declare unbanTimestamp: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

TempBan.init({
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
    unbanTimestamp: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "tempbans",
    sequelize: db
})

TempBan.sync()

export default TempBan;