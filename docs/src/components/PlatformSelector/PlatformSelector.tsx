import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export type PlatformComponents = {
    reactJs: React.ComponentType;
    javascript: React.ComponentType;
};

export const PlatformSelector = (props: PlatformComponents) => {
    return (
        <Tabs className="platform-selector" groupId="platform" queryString>
            <TabItem value="react-js" label="React JS ⚛️">
                {props.reactJs ? <props.reactJs /> : null}
            </TabItem>
            <TabItem value="javascript" label="JavaScript 🟨">
                {props.javascript ? <props.javascript /> : null}
            </TabItem>
        </Tabs>
    );
};
