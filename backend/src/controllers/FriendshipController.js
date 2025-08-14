import { prisma } from '../database/client.js';

export default class FriendshipController {
    async requestFriendship(request, response) {
        const { requester, requested } = request.body;

        // Verifica se as entradas estão presentes:
        if (!requester || !requested) {
            return response.status(400).json({ message: 'Requester and requested users are required!', friendship: null });
        }

        try {
            // Verifica se a solicitação de amizade já existe:
            const existingRequest = await prisma.friendship.findFirst({
                where: {
                    OR: [
                            { requester, requested },
                            { requester: requested, requested: requester }
                        ]
                }
            });

            if (!existingRequest) {
                // Cria uma nova solicitação de amizade:
                const newFriendship = await prisma.friendship.create({
                    data: {
                        requester,
                        requested,
                        status: 'Pendente'
                    }
                });

                // Retorna a solicitação de amizade criada:
                return response.status(201).json({ message: 'Friend request sent successfully!', friendship: newFriendship });

            } else if ((existingRequest.status === 'Recusado') || (existingRequest.status === 'Desfeito')) {
                // Se a solicitação foi recusada ou desfeita, atualiza o status para 'Pendente':
                const updatedFriendship = await prisma.friendship.update({
                    where: {
                        requester: existingRequest.requester,
                        requested: existingRequest.requested
                    },
                    data: { status: 'Pendente' }
                });

                return response.status(200).json({ message: 'Friend request re-sent successfully!', friendship: updatedFriendship });
           
            } else {
                // Se a solicitação já está pendente ou aceita, retorna uma mensagem apropriada:
                return response.status(409).json({ message: 'Friend request already exists!', friendship: existingRequest });
            }
        } catch (error) {
            console.error('Internal server error:', error);
            return response.status(500).json({ message: 'Internal server error!', friendship: null });
        }
    }

    async getFriendship(request, response) {
        const { requester, requested } = request.body;

        // Verifica se as entradas estão presentes:
        if (!requester || !requested) {
            return response.status(400).json({ message: "Requester and requested are required!", friendship: null });
        }

        try {
            // Busca a solicitação de amizade:
            const friendship = await prisma.friendship.findFirst({
                where: {
                    OR: [
                        { requester, requested },
                        { requester: requested, requested: requester }
                    ]
                }
            });

            // Verifica se a solicitação existe:
            if (!friendship) {
                return response.status(404).json({ message: "Friend request not found!", friendship: null });
            }

            // Retorna a solicitação de amizade encontrada:
            return response.status(200).json({ message: "Friend request found!", friendship });

        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", friendship: null });
        }
    }

    async getFriends(request, response) {
        const { requester, status } = request.body;

        // Verifica se o solicitante está presente:
        if (!requester) {
            return response.status(400).json({ message: "Requester is required!", friends: null });
        }

        try {
            // Busca as solicitações de amizade do solicitante:
            const friendships = await prisma.friendship.findMany({
                where: {
                    OR: [
                        { requester, requested: { not: requester } },
                        { requested: requester, requester: { not: requester } }
                    ],
                    status
                },
                orderBy: { created_at: 'desc' }
            });

            // Verifica se existem solicitações:
            if (friendships.length === 0) {
                return response.status(404).json({ message: "No friend requests found!", friends: null });
            }

            // Busca as informações dos amigos encontrados:
            const friends = [];
            for (let friendship of friendships) {
                friends.push(await prisma.user.findUnique({
                    where: { id: friendship.requested === requester ? friendship.requester : friendship.requested }
                }));
            }

            // Retorna as informações das amizade encontradas:
            return response.status(200).json({ message: "Friend requests found!", friends });
        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", friends: null });
        }
    }

    async acceptFriendship(request, response) {
        const { requester, requested } = request.body;

        // Verifica se as entradas estão presentes:
        if (!requester || !requested) {
            return response.status(400).json({ message: "Requester and requested are required!", friendship: null });
        }

        try {
            // Verifica se a solicitação de amizade existe:
            const existingRequest = await prisma.friendship.findFirst({
                where: {
                    OR: [
                        { requester, requested },
                        { requester: requested, requested: requester }
                    ]
                }
            });

            // Verifica se a solicitação de amizade foi encontrada:
            if (!existingRequest) {
                return response.status(404).json({ message: "Friend request not found!", friendship: null });
            }

            // Verifica se a solicitação de amizade está pendente:
            if (existingRequest.status === 'Pendente') {
                // Atualiza o status da solicitação de amizade para 'Aceito':
                const updatedFriendship = await prisma.friendship.update({
                    where: {
                        requester_requested: {
                            requester: existingRequest.requester,
                            requested: existingRequest.requested
                        }
                    },
                    data: { status: 'Aceito' }
                });

                // Retorna a solicitação de amizade atualizada:
                return response.status(200).json({ message: "Friend request accepted successfully!", friendship: updatedFriendship });
            } else {
                return response.status(409).json({ message: "Only pending friend requests can be accepted!", friendship: existingRequest });
            }
        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", friendship: null });
        }
    }

    async declineFriendship(request, response) {
        const { requester, requested } = request.body;

        // Verifica se as entradas estão presentes:
        if (!requester || !requested) {
            return response.status(400).json({ message: "Requester and requested are required!", friendship: null });
        }

        try {
            // Verifica se a solicitação de amizade existe:
            const existingRequest = await prisma.friendship.findFirst({
                where: {
                    OR: [
                        { requester, requested },
                        { requester: requested, requested: requester }
                    ]
                }
            });

            // Verifica se a solicitação de amizade foi encontrada:
            if (!existingRequest) {
                return response.status(404).json({ message: "Friend request not found!", friendship: null });
            }

            // Verifica se a solicitação de amizade está pendente:
            if (existingRequest.status === 'Pendente') {
                // Atualiza o status da solicitação de amizade para 'Recusado':
                const updatedFriendship = await prisma.friendship.update({
                    where: {
                        requester_requested: {
                            requester: existingRequest.requester,
                            requested: existingRequest.requested
                        }
                    },
                    data: { status: 'Recusado' }
                });

                // Retorna a solicitação de amizade atualizada:
                return response.status(200).json({ message: "Friend request declined successfully!", friendship: updatedFriendship });
            } else {
                return response.status(409).json({ message: "Only pending friend requests can be declined!", friendship: existingRequest });
            }
        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", friendship: null });
        }
    }

    async undoFriendship(request, response) {
        const { requester, requested } = request.body;
        
        // Verifica se as entradas estão presentes:
        if (!requester || !requested) {
            return response.status(400).json({ message: "Requester and requested are required!", friendship: null });
        }
        
        try {
            // Verifica se a solicitação de amizade existe:
            const existingRequest = await prisma.friendship.findFirst({
                where: {
                    OR: [
                        { requester, requested },
                        { requester: requested, requested: requester }
                    ]
                }
            });

            // Verifica se a solicitação de amizade foi encontrada:
            if (!existingRequest) {
                return response.status(404).json({ message: "Friend request not found!", friendship: null });
            }

            // Verifica se a solicitação de amizade está aceita:
            if (existingRequest.status === 'Aceito') {
                // Atualiza o status da solicitação de amizade para 'Desfeito':
                const updatedFriendship = await prisma.friendship.update({
                    where: {
                        requester_requested: {
                            requester: existingRequest.requester,
                            requested: existingRequest.requested
                        }
                    },
                    data: { status: 'Desfeito' }
                });

                // Retorna a solicitação de amizade atualizada:
                return response.status(200).json({ message: "Friend request undone successfully!", friendship: updatedFriendship });
            } else {
                return response.status(409).json({ message: "Only accepted friend requests can be undone!", friendship: existingRequest });
            }
        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", friendship: null });
        }
    }
}