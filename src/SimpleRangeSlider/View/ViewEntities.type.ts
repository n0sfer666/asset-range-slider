import Connect from './entities/Connect';
import InputTextValue from './entities/inputs/InputTextValue';
import Pointer from './entities/Pointer';
import Scale from './entities/Scale';
import Tooltip from './entities/Tooltip';

type ViewEntitiesInput = {
  values?: InputTextValue[],
};

interface ViewEntities extends ObjectKeyString {
  pointers: Pointer[],
  tooltip?: Tooltip[],
  connect?: Connect,
  scale?: Scale,
  input?: ViewEntitiesInput
}

export { ViewEntities, ViewEntitiesInput };
