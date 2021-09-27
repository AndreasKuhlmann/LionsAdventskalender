// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.ComponentModel.DataAnnotations;
using BeerBest.Infrastructure.Abstract;

namespace AdventskalenderApi.DataAccess.Models
{
    public class Gewinn : IEntityBase<Guid>, IHasTenantId
    {
        [Key]
        public Guid Id { get; set; }
        string IHasTenantId.TenantId { get; set; }

        public int Tag { get; set; }
        public int Losnummer { get; set; }
        public string Description { get; set; }
    }
}