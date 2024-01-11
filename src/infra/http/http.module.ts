import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/storage.module'
import { AuthModule } from '../auth/auth.module'

import { AuthenticateAdministratorController } from './controllers/administrators/authenticate-administrator.controller'
import { AuthenticateAdministratorUseCase } from '@/domain/logistic/application/use-cases/administrators/authenticate-administrator'
import { RegisterAdministratorController } from './controllers/administrators/register-administrator.controller'
import { RegisterAdministratorUseCase } from '@/domain/logistic/application/use-cases/administrators/register-administrator'
import { RegisterDeliverymanController } from './controllers/deliverymans/register-deliveryman.controller'
import { RegisterDeliverymanUseCase } from '@/domain/logistic/application/use-cases/deliveryman/register-deliveryman'
import { AuthenticateDeliverymanController } from './controllers/deliverymans/authenticate-deliveryman.controller'
import { AuthenticateDeliverymanUseCase } from '@/domain/logistic/application/use-cases/deliveryman/authenticate-deliveryman'
import { ChangePasswordDeliverymanController } from './controllers/deliverymans/change-password-deliveryman.controller'
import { ChangePasswordDeliverymanUseCase } from '@/domain/logistic/application/use-cases/deliveryman/change-password-deliveryman'
import { DeleteDeliverymanController } from './controllers/deliverymans/delete-deliveryman.controller'
import { DeleteDeliverymanUseCase } from '@/domain/logistic/application/use-cases/deliveryman/delete-deliveryman'
import { EditDeliverymanController } from './controllers/deliverymans/edit-deliveryman.controller'
import { EditDeliverymanUseCase } from '@/domain/logistic/application/use-cases/deliveryman/edit-deliveryman'
import { FetchDeliverymansController } from './controllers/deliverymans/fetch-deliverymans.controller'
import { FetchDeliverymansUseCase } from '@/domain/logistic/application/use-cases/deliveryman/fetch-deliverymans'
import { CreateRecipientController } from './controllers/recipients/create-recipient.controller'
import { CreateRecipientUseCase } from '@/domain/logistic/application/use-cases/recipient/create-recipient'
import { EditRecipientController } from './controllers/recipients/edit-recipient.controller'
import { EditRecipientUseCase } from '@/domain/logistic/application/use-cases/recipient/edit-recipient'
import { DeleteRecipientController } from './controllers/recipients/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/logistic/application/use-cases/recipient/delete-recipient'
import { FetchRecipientsController } from './controllers/recipients/fetch-recipients.controller'
import { FetchRecipientsUseCase } from '@/domain/logistic/application/use-cases/recipient/fetch-recipients'
import { CreateOrderController } from './controllers/orders/create-order.controller'
import { CreateOrderUseCase } from '@/domain/logistic/application/use-cases/order/create-order'
import { EditOrderController } from './controllers/orders/edit-order.controller'
import { EditOrderUseCase } from '@/domain/logistic/application/use-cases/order/edit-order'
import { DeleteOrderController } from './controllers/orders/delete-order.controller'
import { DeleteOrderUseCase } from '@/domain/logistic/application/use-cases/order/delete-order'
import { FetchOrdersController } from './controllers/orders/fetch-orders.controller'
import { FetchOrdersUseCase } from '@/domain/logistic/application/use-cases/order/fetch-orders'
import { OrderAvailableForPickupController } from './controllers/administrators/order-available-for-pickup.controller'
import { OrderAvailableForPickupUseCase } from '@/domain/logistic/application/use-cases/administrators/order-available-for-pickup'
import { FetchNearbyOrdersController } from './controllers/deliverymans/fetch-nearby-orders.controller'
import { FetchNearbyOrdersUseCase } from '@/domain/logistic/application/use-cases/deliveryman/fetch-nearby-orders'
import { FetchOrdersDeliverymansController } from './controllers/deliverymans/fetch-orders-deliveryman.controller'
import { FetchOrdersDeliverymansUseCase } from '@/domain/logistic/application/use-cases/deliveryman/fetch-orders-deliverymans'
import { UploadAttachmentController } from './controllers/upload/upload-attachment.controller'
import { UploadAndCreateAttachmentUseCase } from '@/domain/logistic/application/use-cases/attachment/upload-and-create-attachment'
import { MarkOrderDeliveredController } from './controllers/deliverymans/mark-order-delivered.controller'
import { MarkOrderDeliveredUseCase } from '@/domain/logistic/application/use-cases/deliveryman/mark-order-delivered'
import { MarkOrderReturnedController } from './controllers/deliverymans/mark-order-returned.controller'
import { MarkOrderReturnedUseCase } from '@/domain/logistic/application/use-cases/deliveryman/mark-order-returned'
import { PickUpOrderForDeliveryController } from './controllers/deliverymans/pick-up-order-for-delivery.controller'
import { PickUpOrderForDeliveryUseCase } from '@/domain/logistic/application/use-cases/deliveryman/pick-up-order-for-delivery'
import { ReadNotificationController } from './controllers/notifications/read-notification.controller'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule, AuthModule],
  controllers: [
    AuthenticateAdministratorController,
    RegisterAdministratorController,
    RegisterDeliverymanController,
    AuthenticateDeliverymanController,
    ChangePasswordDeliverymanController,
    DeleteDeliverymanController,
    EditDeliverymanController,
    FetchDeliverymansController,
    CreateRecipientController,
    EditRecipientController,
    DeleteRecipientController,
    FetchRecipientsController,
    CreateOrderController,
    EditOrderController,
    DeleteOrderController,
    FetchOrdersController,
    OrderAvailableForPickupController,
    FetchNearbyOrdersController,
    FetchOrdersDeliverymansController,
    UploadAttachmentController,
    MarkOrderDeliveredController,
    MarkOrderReturnedController,
    PickUpOrderForDeliveryController,
    ReadNotificationController,
  ],
  providers: [
    AuthenticateAdministratorUseCase,
    RegisterAdministratorUseCase,
    RegisterDeliverymanUseCase,
    AuthenticateDeliverymanUseCase,
    ChangePasswordDeliverymanUseCase,
    DeleteDeliverymanUseCase,
    EditDeliverymanUseCase,
    FetchDeliverymansUseCase,
    CreateRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    FetchRecipientsUseCase,
    CreateOrderUseCase,
    EditOrderUseCase,
    DeleteOrderUseCase,
    FetchOrdersUseCase,
    OrderAvailableForPickupUseCase,
    FetchNearbyOrdersUseCase,
    FetchOrdersDeliverymansUseCase,
    UploadAndCreateAttachmentUseCase,
    MarkOrderDeliveredUseCase,
    MarkOrderReturnedUseCase,
    PickUpOrderForDeliveryUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
