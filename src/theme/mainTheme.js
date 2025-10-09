// Own
export const mainTheme = {
  token: {
    colorPrimary: "#032C61",
    colorInfo: "#032C61",
    clearBg: "#032C61",
  },

  components: {
    Menu: {
      itemBg: "#F28F00",
      itemColor: "#032C61",
      itemHoverBg: "#de54b1",
      itemHoverColor: "#fff",
      subMenuItemBg: "#EBF7FF",
      itemSelectedBg: "#000",
      itemSelectedColor: "white",
      iconSize: 17,
      itemMarginBlock: 10,
      itemHeight: 56,
      itemPaddingInline: 1,
    },

    Table: {
      headerBg: "#fff",
      headerSplitColor: "white",
      headerColor: "#8B909A",
      colorBgContainer: "var(--demin-primary-00)",
      cellFontSize: 16,
      colorText: "black",
      borderColor: "rgba(255, 255, 255, 0.18)",
      footerColor: "rgba(31, 41, 55, 0.88)",
      footerBg: "rgb(79, 106, 167)",
      headerFilterHoverBg: "transparent",
      rowHoverBg: "#c2c0c0",
      filterDropdownMenuBg: "#fff",
      filterDropdownBg: "#fff",
      colorPrimary: "#1B70A6",
      colorInfo: "#1B70A6",
    },

    Button: {
      colorPrimary: "#de54b1",
      colorPrimaryHover: "#FFD6B3",
    },

    Input: {
      colorBorder: "#de54b1",
    },

    // 👉 Select override
    Select: {
      colorBorder: "#de54b1", // normal border
      optionSelectedBg: "#FFD6B3", // selected option background
      optionSelectedColor: "#032C61", // selected option text color
    },
  },
};
