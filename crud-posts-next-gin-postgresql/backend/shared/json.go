package shared

import "encoding/json"

func InterfaceToStruct(from interface{}, to interface{}) error {
	jsonStr, _ := json.Marshal(from)
	err := json.Unmarshal([]byte(jsonStr), to)
	return err
}
