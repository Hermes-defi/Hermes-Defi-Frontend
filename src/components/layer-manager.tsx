import React from "react";
import theme, { l2Theme } from "theme";
import { ChakraProvider } from "@chakra-ui/react";

const DEFAULT_LAYER = "l1";
const LayerToogleContext = React.createContext<{
  layer: "l1" | "l2";
  setLayer?: (v: string) => void;
}>({
  layer: DEFAULT_LAYER,
});

// hooks
export const useLayer = () => React.useContext(LayerToogleContext).layer;
export const useLayerValue = (l1Value: any, l2Value: any) => {
  const layer = useLayer();
  return layer === "l1" ? l1Value : l2Value;
};

export const useLayerToggle = () => {
  const layer = useLayer();
  return () => React.useContext(LayerToogleContext).setLayer(layer === "l1" ? "l2" : "l1");
};
export const useLayerSwitch = () => {
  return (layer: "l1" | "l2") => React.useContext(LayerToogleContext).setLayer(layer);
};

// managers
export const LayerManager = ({ children }) => {
  const layer = useLayer();

  return <ChakraProvider theme={layer === "l2" ? l2Theme : theme}>{children}</ChakraProvider>;
};

export const LayerProvider = ({ children, defaultValue }) => {
  const [layer, setLayer] = React.useState(defaultValue);

  return (
    <LayerToogleContext.Provider value={{ layer, setLayer: (v) => setLayer(v) }}>
      <LayerManager>{children}</LayerManager>
    </LayerToogleContext.Provider>
  );
};
