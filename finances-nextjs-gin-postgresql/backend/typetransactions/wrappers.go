package typetransactions

func DataToModel(data *TypeTransactionData) TypeTransation {
	return TypeTransation{
		ID:   data.ID,
		Name: NewTypeTransactionName(data.Name),
	}
}
