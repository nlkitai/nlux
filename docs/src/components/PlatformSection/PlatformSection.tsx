import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import './PlatformSection.css';

export type PlatformComponents = {
    reactJs: React.ComponentType;
    javascript: React.ComponentType;
};

export const PlatformSection = (props: PlatformComponents) => {
    return (
        <Tabs className="platform-section" groupId="platform" queryString>
            <TabItem value="react-js">
                {<props.reactJs />}
            </TabItem>
            <TabItem value="javascript">
                {<props.javascript />}
            </TabItem>
        </Tabs>
    );
};
