import { ManageSubscriptionService } from "../../../../application/services"
import { ValidatorAdapter } from "../../../../infrastructure/adapters"
import { SubscriptionRepository, UserRepository } from "../../../../infrastructure/data/typeorm/repositories"
import { ManageSubscriptionController } from "../../../../presentation/controllers"
import { EmailValidation, RequiredFieldValidation, Validation, ValidationComposite } from "../../../../presentation/validations"

export const makeManageSubscriptionValidation = () : Validation => {
    const validations : Validation[] = []
    for(const fieldname of ['subscribeTo']){
        validations.push(new RequiredFieldValidation(fieldname))
        validations.push(new EmailValidation(fieldname, new ValidatorAdapter()))
    }
    return new ValidationComposite(validations)
}

export const makeManageSubscriptionController = () : ManageSubscriptionController => {
    const userRepository = new UserRepository()
    const subscriptionRepository = new SubscriptionRepository()
    const manageSubscriptionService = new ManageSubscriptionService(userRepository, subscriptionRepository)
    return new ManageSubscriptionController(makeManageSubscriptionValidation(), manageSubscriptionService)
}