import {LeftToolbar} from './LeftToolbar.jsx';
import {renderWithState} from '../../utils/configureTest.js';
import ViewMode from '../../store/ViewMode.js';
import {useNeedShow3d} from '../../utils/useNeedShow3d.js';
import {ModeSwitcherToolbar} from './ModeSwitcherToolbar.jsx';
import {ModeFast3dToolbar} from './ModeFast3dToolbar.jsx';
import {Mode2dToolbar} from './Mode2dToolbar.jsx';

jest.mock('./ModeSwitcherToolbar.jsx', () => ({
    ModeSwitcherToolbar: jest.fn(() => <div>ModeSwitcherToolbar</div>),
}));
jest.mock('./ModeFast3dToolbar.jsx', () => ({
    ModeFast3dToolbar: jest.fn(() => <div>ModeFast3dToolbar</div>),
}));
jest.mock('./Mode2dToolbar.jsx', () => ({
    Mode2dToolbar: jest.fn(() => <div>Mode2dToolbar</div>),
}));

jest.mock('../../utils/useNeedShow3d.js');
const mockedUseNeedShow3d = useNeedShow3d;
describe('test leftToolbar', () => {
    it('should be render modeFast3Dtollbar', () => {
        mockedUseNeedShow3d.mockReturnValue(true);
        // eslint-disable-next-line react/react-in-jsx-scope
        const {store} = renderWithState(<LeftToolbar/>, {viewMode: ViewMode.VIEW_3D_LIGHT});
        expect(store.getState().viewMode).toBe(ViewMode.VIEW_3D_LIGHT);
        expect(ModeSwitcherToolbar).toBeCalledTimes(1);
        expect(ModeFast3dToolbar).toBeCalledTimes(1);
        expect(Mode2dToolbar).toBeCalledTimes(0);
    });

    it('should be render mode2DTollbar', () => {
        mockedUseNeedShow3d.mockReturnValue(true);
        // eslint-disable-next-line react/react-in-jsx-scope
        const {store} = renderWithState(<LeftToolbar/>, {viewMode: ViewMode.VIEW_2D});
        expect(store.getState().viewMode).toBe(ViewMode.VIEW_2D);
        expect(ModeSwitcherToolbar).toBeCalledTimes(2);
        expect(ModeFast3dToolbar).toBeCalledTimes(1);
        expect(Mode2dToolbar).toBeCalledTimes(1);
    });
});
