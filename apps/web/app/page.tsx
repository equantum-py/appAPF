import DemoLayout from "./demo/layout";
import ArbitroLayout from "./demo/arbitro/layout";
import TabsLayout from "./demo/arbitro/(tabs)/layout";
import { Inicio } from "./demo/arbitro/_ui/inicio";

export default function Home() {
  return (
    <DemoLayout>
      <ArbitroLayout>
        <TabsLayout>
          <Inicio />
        </TabsLayout>
      </ArbitroLayout>
    </DemoLayout>
  );
}
