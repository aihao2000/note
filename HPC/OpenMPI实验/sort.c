#include <stdio.h>
#include <stdlib.h>
#include <mpi.h>
#include <string.h>
#define RMAX 1000
int n, comm_size, fin;
int *a = NULL;
int local_n, my_rank;
int *local_arr = NULL;
int *pre_arr = NULL;
int *tmp_arr = NULL;
void Generate_list()
{
    srandom(my_rank + 1);
    for (int i = 0; i < local_n; i++)
    {
        local_arr[i] = random() % RMAX;
    }
}
void local_sort()
{
    for (int flg = 0;; flg = !flg)
    {
        int fin2 = 1;
        for (int i = 0; i < local_n - 1; i++)
        {
            if (local_arr[i] > local_arr[i + 1])
            {
                fin2 = 0;
                break;
            }
        }
        if (fin2)
        {
            break;
        }
        for (int i = flg; i < local_n - 1; i += 2)
        {
            if (local_arr[i] > local_arr[i + 1])
            {
                int tmp = local_arr[i];
                local_arr[i] = local_arr[i + 1];
                local_arr[i + 1] = tmp;
            }
        }
    }
}
void sort()
{
    local_sort();
    for (int flg = 1;; flg = !flg)
    {
        MPI_Gather(local_arr, local_n, MPI_INT, a, local_n, MPI_INT, 0, MPI_COMM_WORLD);
        fin = 1;
        if (my_rank == 0)
        {
            for (int i = 0; i < n - 1; i++)
            {
                if (a[i] > a[i + 1])
                {
                    fin = 0;
                    break;
                }
            }
        }
        MPI_Bcast(&fin, 1, MPI_INT, 0, MPI_COMM_WORLD);
        if (fin)
        {
            break;
        }
        int state = flg ? my_rank % 2 == 0 : my_rank % 2 == 1; // 1 send 0 recv -1 free
        if (state == 1 && my_rank == comm_size - 1)
        {
            state = -1;
        }
        else if (state == 0 && my_rank == 0)
        {
            state = -1;
        }
        if (state == 1)
        {
            MPI_Ssend(local_arr, local_n, MPI_INT, my_rank + 1, 0, MPI_COMM_WORLD);
            MPI_Recv(local_arr, local_n, MPI_INT, my_rank + 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        }
        else if (state == 0)
        {
            MPI_Recv(pre_arr, local_n, MPI_INT, my_rank - 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
            int i = 0, j = 0, k = 0;
            while (i < local_n && j < local_n)
            {
                if (pre_arr[i] <= local_arr[j])
                {
                    tmp_arr[k++] = pre_arr[i++];
                }
                else
                {
                    tmp_arr[k++] = local_arr[j++];
                }
            }
            while (i < local_n)
            {
                tmp_arr[k++] = pre_arr[i++];
            }
            while (j < local_n)
            {
                tmp_arr[k++] = local_arr[j++];
            }
            memcpy(local_arr, tmp_arr + local_n, local_n * sizeof(int));
            memcpy(pre_arr, tmp_arr, local_n * sizeof(int));
            MPI_Ssend(pre_arr, local_n, MPI_INT, my_rank - 1, 0, MPI_COMM_WORLD);
        }
        MPI_Barrier(MPI_COMM_WORLD);
    }
}
int main(int argc, char **argv)
{
    MPI_Init(&argc, &argv);
    MPI_Comm_size(MPI_COMM_WORLD, &comm_size);
    MPI_Comm_rank(MPI_COMM_WORLD, &my_rank);
    if (my_rank == 0)
    {
        if (argc > 1)
        {
            n = atoi(argv[1]);
        }
        else
        {
            n = 1000;
        }
        a = (int *)malloc(n * sizeof(int));
    }
    MPI_Bcast(&n, 1, MPI_INT, 0, MPI_COMM_WORLD);
    local_n = n / comm_size;
    local_arr = (int *)malloc(local_n * sizeof(int));
    pre_arr = (int *)malloc(local_n * sizeof(int));
    tmp_arr = (int *)malloc(2 * local_n * sizeof(int));
    Generate_list();
    MPI_Gather(local_arr, local_n, MPI_INT, a, local_n, MPI_INT, 0, MPI_COMM_WORLD);
    if (my_rank == 0)
    {
        for (int i = 0; i < comm_size; i++)
        {
            printf("%d:", i);
            for (int j = 0; j < local_n; j++)
            {
                printf(" %d", a[i * local_n + j]);
            }
            printf("\n");
        }
    }
    sort();
    MPI_Gather(local_arr, local_n, MPI_INT, a, local_n, MPI_INT, 0, MPI_COMM_WORLD);
    if (my_rank == 0)
    {
        for (int i = 0; i < n; i++)
        {
            printf("%d ", a[i]);
        }
        printf("\n");
    }
    MPI_Finalize();
    return 0;
}
