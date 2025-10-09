import { Tabs } from "antd";

import React from "react";
import EditorTable from "./EditorTable";
import ViewerTable from "./ViewerTable";

const { TabPane } = Tabs;

function ManageEditorAndViewer() {
  return (
    <div>
      <Tabs>
        <TabPane tab="Editor" key="1">
          <EditorTable />
        </TabPane>

        <TabPane tab="Viewer" key="2">
          <ViewerTable />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default ManageEditorAndViewer;
