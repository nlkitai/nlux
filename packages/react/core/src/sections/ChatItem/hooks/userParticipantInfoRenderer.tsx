import {FunctionComponent, useMemo} from 'react';
import {AvatarComp} from '../../../components/Avatar/AvatarComp';
import {ChatItemProps} from '../props';

export const useParticipantInfoRenderer = function<AiMsg>(
    props: ChatItemProps<AiMsg>
): FunctionComponent {
    const participantInfo = useMemo(() => {
        return (
            <div className="nlux-comp-chatItem-participantInfo">
                {(props.avatar !== undefined) && (
                    <AvatarComp name={props.name} avatar={props.avatar}/>
                )}
                <span className="nlux-comp-chatItem-participantName">{props.name}</span>
            </div>
        );

    }, [props.avatar, props.name]);

    return () => <>{participantInfo}</>
};
