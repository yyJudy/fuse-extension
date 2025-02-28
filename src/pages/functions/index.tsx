import { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { FusePage } from '~components/layouts/page';
import { useCurrentState } from '~hooks/memo/current_state';
import { useSecuredData } from '~hooks/store';
import type { WindowType } from '~types/pages';
import { CurrentState } from '~types/state';

import HomePage from './home';
import ReceivePage from './receive';
import RecordPage from './record';
import SearchPage from './search';
import SendPage from './send';
import SettingPage from './settings';
import SwapPage from './swap';

export type MainPageState = 'home' | 'search' | 'setting' | 'send' | 'receive' | 'swap' | 'record';

function MainPage({ wt }: { wt: WindowType }) {
    const current_state = useCurrentState();

    return (
        <FusePage current_state={current_state} states={CurrentState.ALIVE}>
            <InnerMainPage wt={wt} />
        </FusePage>
    );
}

export default MainPage;

const InnerMainPage = ({ wt }: { wt: WindowType }) => {
    const { current_address } = useSecuredData();
    console.debug(`🚀 ~ MainPage ~ current_address:`, wt, current_address);

    const [state, setState] = useState<MainPageState>('home');
    if (!current_address) return <></>;
    return (
        <div className="w-full">
            {state === 'home' && <HomePage setState={setState}></HomePage>}
            <TransitionGroup>
                <CSSTransition key={state} classNames="slide" timeout={300}>
                    <div>
                        {state === 'search' && <SearchPage setState={setState}></SearchPage>}
                        {state === 'setting' && <SettingPage setState={setState}></SettingPage>}
                        {state === 'send' && <SendPage setState={setState}></SendPage>}
                        {state === 'receive' && <ReceivePage setState={setState}></ReceivePage>}
                        {state === 'swap' && <SwapPage setState={setState}></SwapPage>}
                        {state === 'record' && <RecordPage setState={setState}></RecordPage>}
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
};
