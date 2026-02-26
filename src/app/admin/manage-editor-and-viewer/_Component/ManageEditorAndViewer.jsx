import { Tabs } from "antd";

import React from "react";
import EditorTable from "./EditorTable";
import ViewerTable from "./ViewerTable";
import AdminTable from "./AdminTable";

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
        <TabPane tab="Extra Admin" key="3">
          <AdminTable />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default ManageEditorAndViewer;
