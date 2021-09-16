import Connect from './entities/Connect';
import Pointer from './entities/Pointer';
import Scale from './entities/Scale';

interface ViewEntities extends ObjectKeyString {
  pointers: Pointer[],
  connect?: Connect,
  scale?: Scale,
}

export default ViewEntities;
