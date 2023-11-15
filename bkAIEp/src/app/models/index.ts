import { PatientModel } from "@app/models/patientModel"
import { EventModel } from "@app/models/eventModel"
import { ExamModel } from "@app/models/examModel"
import { NotificationModel } from "@app/models/notificationModel"
import { PredictionModel } from "@app/models/predictionModel"
import { UserModel } from "@app/models/userModel"
import { PermissionModel } from "@app/models/permissionModel"
import { RoleModel } from "@app/models/roleModel"


export {
  RoleModel as Role,
  PermissionModel as Permission,
  UserModel as User,
  PatientModel as Patient,
  EventModel as Event,
  ExamModel as Exam,
  NotificationModel as Notification,
  PredictionModel as Prediction
}