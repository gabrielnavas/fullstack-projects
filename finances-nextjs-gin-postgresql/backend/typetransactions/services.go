package typetransactions

type TypeTransactionService struct {
	ttr *TypeTransactionRepository
}

func NewTypeTransactionService(
	ttr *TypeTransactionRepository,
) *TypeTransactionService {
	return &TypeTransactionService{ttr}
}

func (s *TypeTransactionService) FindTypeTransactionById(id string) (*TypeTransaction, error) {
	td, err := s.ttr.FindTransactionById(id)
	if err != nil {
		return nil, err
	}
	return td, nil
}

func (s *TypeTransactionService) FindTypeTransactions() ([]*TypeTransaction, error) {
	tts, err := s.ttr.FindTransactions()
	if err != nil {
		return nil, err
	}
	return tts, nil
}
