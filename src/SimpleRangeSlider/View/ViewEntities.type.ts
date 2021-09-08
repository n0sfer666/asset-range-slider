import Connect from './entities/Connect';
import Pointer from './entities/Pointer';
import Scale from './entities/Scale';
import Tooltip from './entities/Tooltip';

interface ViewEntities extends ObjectKeyString {
  pointers: Pointer[],
  tooltip?: Tooltip[],
  connect?: Connect,
  scale?: Scale,
}

export default ViewEntities;
