import Connect from './entities/Connect';
import Pointer from './entities/Pointer';
import Scale from './entities/Scale';
interface ViewEntities extends ObjectKeyString {
    pointers: Pointer[];
    connect?: Connect | null;
    scale?: Scale | null;
}
export default ViewEntities;
