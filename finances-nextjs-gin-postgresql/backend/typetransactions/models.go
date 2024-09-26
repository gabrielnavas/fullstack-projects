package typetransactions

import "log"

type TypeTransactionName uint8

const (
	Income = iota
	Expense
)

func NewTypeTransactionName(ttName string) TypeTransactionName {
	switch ttName {
	case "income":
		return Income
	case "expense":
		return Expense
	default:
		log.Println("invalid type transaction selected")
		return 0
	}
}

func (ttn TypeTransactionName) String() string {
	switch ttn {
	case Income:
		return "income"
	case Expense:
		return "expense"
	default:
		log.Println("invalid type transaction selected")
		return "invalid type transaction"
	}
}

type TypeTransaction struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
