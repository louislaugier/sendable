package utils

import (
	"encoding/json"
	"errors"
)

func InterfaceToStruct(v interface{}, s interface{}) (interface{}, error) {
	m, err := interfaceToMap(v)
	if err != nil {
		return nil, err
	}

	s, err = MapToStruct(m, s)
	if err != nil {
		return nil, err
	}

	return s, nil
}

func MapToStruct(m map[string]interface{}, i interface{}) (interface{}, error) {
	jsonData, err := json.Marshal(m)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(jsonData, &i); err != nil {
		return nil, err
	}

	return i, err
}

func interfaceToMap(i interface{}) (map[string]interface{}, error) {
	m, ok := i.(map[string]interface{})
	if !ok {
		return nil, errors.New("error casting interface to map")
	}

	return m, nil
}
