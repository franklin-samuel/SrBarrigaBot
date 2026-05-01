import {Module} from '@nestjs/common';
import {WebModule} from "./web/configuration/web.module.js";
import {SecurityModule} from "./security/configuration/security.module.js";
import {BusinessModule} from "./business/configuration/business.module.js";
import {PersistenceModule} from "./persistence/configuration/persistence.module.js";

@Module({
  imports: [WebModule, SecurityModule, BusinessModule, PersistenceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
